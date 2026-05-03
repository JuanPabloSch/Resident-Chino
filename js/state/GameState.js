export const GameState = {
    hp: 100,
    maxHp: 100,

    // Pistola
    magazine: 8,
    maxMagazine: 8,

    // Shotgun
    shotgunAmmo: 2,
    shotgunMaxAmmo: 2,

    // Armas
    weapon: "pistol",
    hasShotgun: false,

    // Progress
    hasKey: false,
    hasFinalKey: false,

    lockdownSolved: false,
    buttonSolved: false,

    // Spawn entre rooms
    nextSpawnX: null,
    nextSpawnY: null
};