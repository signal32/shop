import type { PostHandler } from "#src/handler.ts"
import sanitize from "sanitize-filename"
import { config } from "./config.ts"
import path from "path"

export const previewModelHandler: PostHandler<{ id: string }, {}> = async (req, res, next) => {
    const id = sanitize(req.params['id'])
    const { signTemplateDir } = config
    const modelPath = path.join(signTemplateDir, id, 'preview.glb')

    res.sendFile(modelPath, err => {
        if (err) {
            console.error(err)
            res.status(500).json({ error: err.toString() })
        }
    })
}
