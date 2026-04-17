import type { PostHandler } from "#src/handler.ts";
import { readdir } from "fs/promises";
import path from "path";
import { config } from "./config.ts";

type SignOption = {
    id: string,
    name: string,
    previewModelUrl: string
}

export const listSignsPostHandler: PostHandler<{}, {
    signs: SignOption[]
}> = async (req, res, next) => {
    const { signTemplateDir } = config

    const signs: SignOption[] = []
    const entries = await readdir(signTemplateDir, { withFileTypes: true })

    for (const entry of entries) {
        if (!entry.isDirectory()) continue

        const id = entry.name
        signs.push({
            id,
            name: `Sign: ${id}`,
            previewModelUrl: `/previewModel/${id}`
        })
    }

    res.status(200).json({ signs })
}
