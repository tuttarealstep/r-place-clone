interface ColorPalette {
    [key: number]: string;
}

const colorPalette: ColorPalette = {
    0:  "#ffffff",
    1:  "#bd0038", 
    2:  "#ff4500",
    3:  "#ffa800",
    4:  "#ffd636",
    5:  "#ffb470",
    6:  "#fff8b9",
    7:  "#7fed56",
    8:  "#00cc77",
    9:  "#00a468",
    10: "#00756f",
    11: "#51e9f4",
    12: "#00ccc0",
    13: "#2350a3",
    14: "#368fe9",
    15: "#009eaa",
    16: "#b34ac0",
    17: "#4a3ac1",
    18: "#811e9f",
    19: "#6b5cff",
    20: "#de107f",
    21: "#ff3881",
    22: "#6d011b",
    23: "#6d482e",
    24: "#9c6927",
    25: "#898d90",
    26: "#93b3fe",
    27: "#ff98a9",
    28: "#d3d7da",
    29: "#515352",
    255: "#000000"
}

const getAvaiableColors = (): number[] => {
    return (process.env.AVAIABLE_COLORS || '').split(',').map(colorId => parseInt(colorId));
}

const getAvaiableColorsAssociation = () => {
    const avaiableColors = getAvaiableColors();

    const colorAssociation: { id: number; value: string; hex: {
        r: number;
        g: number;
        b: number;
    } }[] = [];

    avaiableColors.forEach((color: number) => {
        const colorHex = Uint8Array.from(Buffer.from(colorPalette[color].slice(1), 'hex'));
        colorAssociation.push({
            id: color,
            value: colorPalette[color],
            hex: {
                r: colorHex[0],
                g: colorHex[1],
                b: colorHex[2]
            }
        });
    });

    return colorAssociation
}

const isColorAvaiable = (color: number): boolean => {
    //Max 255 colors

    if (color < 0 || color > 255) {
        return false;
    }

    const avaiableColors = getAvaiableColors();

    if (Object.keys(colorPalette).includes(color.toString()) && avaiableColors.includes(color)) {
        return true;
    }

    return false;
}

export {
    colorPalette,
    getAvaiableColors,
    isColorAvaiable,
    getAvaiableColorsAssociation
}
