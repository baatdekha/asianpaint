function hexToRgb(hex) {
    // Remove '#' if present 
    hex = hex.replace(/^#/, '');

    // Convert 3-digit hex to 6-digit
    if (hex.length === 3) {
        hex = hex.replace(/(.)/g, '$1$1');
    }

    // Parse hex to RGB
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return [r, g, b];
}
/*
function rgbToHsl(color) {
    const [r, g, b] = color.map(c => c / 255);

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}
*/
function rgbToHsl(color) {
    const [r, g, b] = color.map(c => c / 255);

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h = Math.round(h * 60); // Convert hue to degrees
        if (h < 0) h += 360;
        s = Math.round(s * 100); // Convert saturation to percentage
        l = Math.round(l * 100); // Convert lightness to percentage
    }

    return [h, s, l];
}
function hexToHsl(color) {
  return rgbToHsl(hexToRgb(color));
}

export {hexToRgb, rgbToHsl, hexToHsl};