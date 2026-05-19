/**
 * A fulfillment handler for TS custom sign products.
 * Note that this would be better placed in a separate repository/service, but is currently here for convenience.
 */

import { s3Client } from "#src/s3.ts";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { createReadStream } from "fs";
import { exec } from "node:child_process";
import { createWriteStream } from "node:fs";
import { access, cp, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import util from 'node:util';
import sanitize from "sanitize-filename";
import sharp from "sharp";
import type { FulfillmentHandler } from "../routes/fulfillOrder.ts";
import { constants } from "fs";
import { config } from "./config.ts";

const execAsync = util.promisify(exec)


export const signOrderFulfillmentHandler: FulfillmentHandler = async (req, res, next) => {
    console.log('Generating sign files...')

    const { textureFilename, signConfig } = req.body.config.meta
    if (typeof textureFilename !== 'string') throw new Error('Texture file name required.')
    const parsedSignConfig = JSON.parse(signConfig)
    const provider = sanitize(req.body.config.options['provider'].value)
    if (typeof provider !== 'string') throw new Error('Expected provider')
    const product = sanitize(req.body.config.options['product'].value)
    if (typeof product !== 'string') throw new Error('Expected product')
    const name = sanitize(req.body.config.options['name'].value)
    if (typeof name !== 'string') throw new Error('Expected name')

    //TODO: sanitize these and generally make this sane.
    const { railworksDir, signTemplateDir } = config
    const currentSignTemplateDir = path.join(signTemplateDir, parsedSignConfig.signId) //TODO: validate signid to avoid injection!
    const workDir = path.join(railworksDir, `work/${provider}-${product}-${name}`)
    const buildDir = path.join(railworksDir, `builds/${provider}-${product}-${name}`)
    const buildArchivePath = path.join(railworksDir, `builds/${provider}-${product}-${name}.zip`)

    await cp(currentSignTemplateDir, workDir, { recursive: true })

    // Fetch user texture
    const bucket = 'shop-user-uploads'
    const textureObjectKey = req.body.config.meta['textureFilename']
    const getTextureCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: textureObjectKey,
    })
    const response = await s3Client.send(getTextureCommand)
    if (!(response.Body instanceof Readable)) {
        throw new Error("Expected a Node.js Readable stream");
    }
    const userTexturePath = path.join(workDir, 'userTex.png')
    const writeStream = createWriteStream(userTexturePath)
    await pipeline(response.Body, writeStream)

    // Insert user texture into maintex

    const templatePath = path.join(workDir, 'maintex_template.png')
    const texturePath = path.join(workDir, 'textures', 'maintex.png')
    const baseImage = sharp(await exists(texturePath) ? texturePath : templatePath)
    const combinedImagePath = path.join(workDir, 'maintex_combined.png')
    const ddsImagePath = path.join(workDir, 'textures', 'maintex.dds')

    const overlayImage = await sharp(userTexturePath).toBuffer()
    await baseImage
        .composite([{
            input: overlayImage,
            top: 0,
            left: 0,
        }])
        .png()
        .toFile(combinedImagePath)

    // Convert it into a dds
    // Requires ImageMagick. TS has to do its own compression.
    const ddsArgs = "-depth 8 -define dds:compression=none -define dds:format=rgba"
    await execAsync(`convert "${combinedImagePath}" ${ddsArgs} "${ddsImagePath}"`)

    // convert png images to dds
    for (const file of await (readdir(path.join(workDir, 'textures'), { withFileTypes: true }))) {
        if (file.name.toLowerCase().endsWith('.dds')) continue
        const inputPath = path.join(file.parentPath, file.name)
        const outputPath = path.join(file.parentPath, path.parse(file.name).name) + ".dds"
        if (await exists(outputPath)) continue
        await execAsync(`convert "${inputPath}" ${ddsArgs} "${outputPath}"`)
    }

    // Build and archive TS asset
    const { stdout, stderr } = await execAsync([
        `cd ${path.join(railworksDir, 'scripts')} &&`,
        [
            'python',
            'make_asset.py',
            `--provider "${provider}"`,
            `--product "${product}"`,
            `--name "${name}"`,
            String.raw`--rw-dir "Z:\home\hw\dev\railworks\scripts\railworks"`, // TODO: get from env var
            `--build-dir "${buildDir}"`,
            `--ts-tool-prefix=wine`,
            String.raw`--script-path="Z:\home\hw\dev\railworks\scripts"`, // TODO: get from env var
            `--prebuilt-geometry "${path.join(workDir, 'geometry.GeoPcDx')}"`,
            `"${workDir}"`,
            `&&`
        ].join(' '),
        `zip -r "${buildArchivePath}" "${buildDir}"`
    ].join(' '))
    console.log(stdout, stderr)

    // Upload asset archive
    const fileStream = createReadStream(buildArchivePath)
    const buildObjectKey = `${textureObjectKey}-build`
    const uploadBuildCommand = new PutObjectCommand({
        Bucket: bucket,
        Key: buildObjectKey,
        ContentType: 'application/zip',
        Body: fileStream,
    })

    try {
        await s3Client.send(uploadBuildCommand)
    }
    catch (err) {
        res.status(500).send()
    }

    // Delete local artifacts
    await rm(workDir, { recursive: true })
    await rm(buildDir, { recursive: true })
    await rm(buildArchivePath)

    res.status(200).json({
        files: [{
            key: buildObjectKey,
            bucket,
            name: 'Asset files'
        }]
    })
}

async function exists(path: string) {
    try {
        await access(path, constants.F_OK);
        return true;
    } catch {
        return false;
    }
}
