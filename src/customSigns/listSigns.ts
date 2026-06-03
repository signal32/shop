import type { PostHandler } from "#src/handler.ts";
import { readdir, readFile } from "fs/promises";
import path, { join } from "path";
import { config } from "./config.ts";
import { existsSync } from "fs";

type SignOption = {
    id: string,
    name: string,
    previewModelUrl: string,
    defaultConfig?: Object // TODO use SignConfig type
}

export const listSignsPostHandler: PostHandler<{}, {
    signs: SignOption[]
}> = async (req, res, next) => {
    const { signTemplateDir } = config

    const signs: SignOption[] = []
    const entries = await readdir(signTemplateDir, { withFileTypes: true })

    for (const entry of entries) {
        const metaPath = join(entry.parentPath, entry.name, 'meta.json')
        if (!entry.isDirectory() || !existsSync(metaPath)) continue

        const meta = JSON.parse((await readFile(metaPath)).toString())
        if (meta.hidden) continue
        const id = entry.name
        signs.push({
            id,
            name: meta.name,
            previewModelUrl: `/previewModel/${id}`,
            defaultConfig: meta.defaultConfig,
        })
    }

    res.status(200).json({ signs })
}
