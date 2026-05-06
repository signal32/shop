import path from "path"

const railworksDir = process.env['SHOP_RAILWORKS_DIR']
const signTemplateDir = path.join(railworksDir, 'source/RailsDevelopments/CustomSigns')

export const config = {
    railworksDir,
    signTemplateDir,
}
