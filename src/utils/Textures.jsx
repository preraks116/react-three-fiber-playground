export default function getTexture(key) {
    // dict of dicts
    const textures = {
        "TactilePaving": {
        map: 'src/textures/tile/TactilePaving003_1K_Color.jpg',
        normalMap: 'src/textures/tile/TactilePaving003_1K_NormalDX.jpg',
        roughnessMap: 'src/textures/tile/TactilePaving003_1K_Roughness.jpg',
        },
        "Asphalt": {
        map: 'src/textures/road/Asphalt015_2K_Color.jpg',
        normalMap: 'src/textures/road/Asphalt015_2K_NormalDX.jpg',
        roughnessMap: 'src/textures/road/Asphalt015_2K_Roughness.jpg',
        },
        "Wood": {
        map: 'src/textures/wood/WoodFloor041_1K_Color.jpg',
        normalMap: 'src/textures/wood/WoodFloor041_1K_NormalDX.jpg',
        roughnessMap: 'src/textures/wood/WoodFloor041_1K_Roughness.jpg',
        aoMap: 'src/textures/wood/WoodFloor041_1K_AmbientOcclusion.jpg',
        },
        "ChristmasOrnament": {
        map: 'src/textures/ball/ChristmasTreeOrnament002_1K_Color.jpg',
        normalMap: 'src/textures/ball/ChristmasTreeOrnament002_1K_NormalDX.jpg',
        roughnessMap: 'src/textures/ball/ChristmasTreeOrnament002_1K_Roughness.jpg',
        }
    }
    return textures[key];
}