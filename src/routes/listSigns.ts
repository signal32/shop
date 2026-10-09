import { config } from "#src/customSigns/config.ts";
import { existsSync } from "fs";
import { readdir, readFile } from "fs/promises";
import { join } from "path";
import type { OpenApiRouter } from "./router.ts";

export function useOpenApiRouter(openApiRouter: OpenApiRouter) {
    openApiRouter.get('/listSigns', {
        async handler(req, res) {
            const { signTemplateDir } = config

            const entries = await readdir(signTemplateDir, { withFileTypes: true })

            const signs = (await Promise.all(entries.map(async entry => {
                const metaPath = join(entry.parentPath, entry.name, 'meta.json')
                if (!entry.isDirectory() || !existsSync(metaPath)) return

                const meta = JSON.parse((await readFile(metaPath)).toString())
                if (meta.hidden) return
                const id = entry.name
                return {
                    id,
                    name: `${meta.name}`,
                    previewModelUrl: `/signs/previewModel/${id}`,
                    defaultConfig: meta.defaultConfig,
                }
            }))).filter(sign => sign !== undefined)



            res.status(200).json({ signs })
        }
    })
}
