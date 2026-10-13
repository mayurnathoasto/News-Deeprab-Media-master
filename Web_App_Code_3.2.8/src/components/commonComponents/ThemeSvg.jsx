import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";

const ThemeSvg = ({ src, width, height, className, alt, colorMap }) => {
    const [svgContent, setSvgContent] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resolvedColors, setResolvedColors] = useState({ primary: '', hover: '', light: '' });
    const [rawSvg, setRawSvg] = useState('');

    const svgUrl = typeof src === 'string' ? src : (src?.src || src?.default || '');

    // ✅ Stable colorMap reference — prevents infinite loop from {} prop
    const colorMapRef = useRef(colorMap);
    useEffect(() => {
        colorMapRef.current = colorMap;
    });

    // ✅ Stable serialized colorMap for dependency comparison only
    const colorMapString = useMemo(
        () => JSON.stringify(colorMap ?? {}),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify(colorMap ?? {})]
    );

    const readCssVars = useCallback(() => {
        if (typeof window === 'undefined') return null;
        const computedStyle = window.getComputedStyle(document.documentElement);
        return {
            primary: computedStyle.getPropertyValue('--primary-color').trim(),
            hover: computedStyle.getPropertyValue('--hover-color').trim(),
            light: computedStyle.getPropertyValue('--primary-light-color').trim(),
        };
    }, []);

    // Watch CSS variable changes
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const update = () => {
            const vars = readCssVars();
            if (!vars) return;
            setResolvedColors(prev => {
                if (
                    prev.primary === vars.primary &&
                    prev.hover === vars.hover &&
                    prev.light === vars.light
                ) return prev; // ✅ same reference if unchanged — won't trigger re-render
                return vars;
            });
        };

        update();

        const observer = new MutationObserver(update);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['style', 'class']
        });

        return () => observer.disconnect();
    }, [readCssVars]);

    const createLighterColor = useCallback((color) => {
        try {
            if (color.startsWith('#')) {
                let hex = color.replace('#', '');
                if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                const lightness = 0.8;
                const newR = Math.round(r + (255 - r) * lightness);
                const newG = Math.round(g + (255 - g) * lightness);
                const newB = Math.round(b + (255 - b) * lightness);
                return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
            }
            if (color.startsWith('rgb')) {
                const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
                if (rgbMatch) {
                    const r = parseInt(rgbMatch[1], 10);
                    const g = parseInt(rgbMatch[2], 10);
                    const b = parseInt(rgbMatch[3], 10);
                    const lightness = 0.8;
                    const newR = Math.round(r + (255 - r) * lightness);
                    const newG = Math.round(g + (255 - g) * lightness);
                    const newB = Math.round(b + (255 - b) * lightness);
                    return `rgb(${newR}, ${newG}, ${newB})`;
                }
            }
            return '#f7ccdd';
        } catch (e) {
            return '#f7ccdd';
        }
    }, []);

    const processSvg = useCallback((svgText, primaryColor, hoverColor, lightColor) => {
        try {
            let processedSvg = svgText;

            const resolvedLight = lightColor || createLighterColor(primaryColor) || '#f7ccdd';
            const resolvedPrimary = primaryColor || '#e13975';
            const resolvedHover = hoverColor || '#6d1d50';

            const fullColorMap = {
                "#e13975": resolvedPrimary,
                "#E13975": resolvedPrimary,
                "#5A5BB5": resolvedPrimary,
                "#5a5bb5": resolvedPrimary,
                "#0F31AC": resolvedPrimary,
                "#0f31ac": resolvedPrimary,
                "#EE2934": resolvedPrimary,
                "#ee2934": resolvedPrimary,

                "#6d1d50": resolvedHover,
                "#6D1D50": resolvedHover,
                "#04294C": resolvedHover,
                "#04294c": resolvedHover,
                "#02203D": resolvedHover,
                "#02203d": resolvedHover,

                "#f7ccdd": resolvedLight,
                "#F7CCDD": resolvedLight,
                "#EEF2FA": resolvedLight,
                "#eef2fa": resolvedLight,
                "#D3DCEF": resolvedLight,
                "#d3dcef": resolvedLight,
                "#F4F6FC": resolvedLight,
                "#f4f6fc": resolvedLight,
                "#E3E9F7": resolvedLight,
                "#e3e9f7": resolvedLight,

                // ✅ Read from ref — stable, no re-render trigger
                ...colorMapRef.current
            };

            const uniqueId = `svg-grad-${Date.now()}`;
            const idRegex = /id="([^"]+)"/g;
            let match;

            while ((match = idRegex.exec(svgText)) !== null) {
                const oldId = match[1];
                const newId = `${oldId}-${uniqueId}`;
                processedSvg = processedSvg.replace(new RegExp(`id="${oldId}"`, 'g'), `id="${newId}"`);
                processedSvg = processedSvg.replace(new RegExp(`url\\(#${oldId}\\)`, 'g'), `url(#${newId})`);
                processedSvg = processedSvg.replace(new RegExp(`xlink:href="#${oldId}"`, 'g'), `xlink:href="#${newId}"`);
                processedSvg = processedSvg.replace(new RegExp(`href="#${oldId}"`, 'g'), `href="#${newId}"`);
            }

            Object.entries(fullColorMap).forEach(([originalColor, replacementColor]) => {
                if (originalColor.includes('url(#')) return;
                if (!replacementColor) return;
                if (!isNaN(Number(originalColor))) return;
                const colorRegex = new RegExp(
                    originalColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
                    'g'
                );
                processedSvg = processedSvg.replace(colorRegex, replacementColor);
            });

            processedSvg = processedSvg.replace(/stop-color="#e13975"/gi, `stop-color="${resolvedPrimary}"`);
            processedSvg = processedSvg.replace(/stop-color="#EE2934"/gi, `stop-color="${resolvedPrimary}"`);
            processedSvg = processedSvg.replace(/stop-color="#6d1d50"/gi, `stop-color="${resolvedHover}"`);

            if (svgUrl.includes('error.svg')) {
                processedSvg = processedSvg.replace(/<text[^>]*?fill="[^"]*"[^>]*>/, m =>
                    m.replace(/fill="[^"]*"/, 'fill="#ffffff"')
                );
            }

            const viewBoxMatch = processedSvg.match(/viewBox="([^"]+)"/);
            const widthMatch = processedSvg.match(/width="([^"]+)"/);
            const heightMatch = processedSvg.match(/height="([^"]+)"/);

            if (!viewBoxMatch && widthMatch && heightMatch) {
                const w = widthMatch[1].replace(/[^0-9.]/g, '');
                const h = heightMatch[1].replace(/[^0-9.]/g, '');
                processedSvg = processedSvg.replace(/<svg/, `<svg viewBox="0 0 ${w} ${h}"`);
            }

            if (widthMatch) {
                processedSvg = processedSvg.replace(widthMatch[0], 'width="100%"');
            } else {
                processedSvg = processedSvg.replace(/<svg/, '<svg width="100%"');
            }

            if (heightMatch) {
                processedSvg = processedSvg.replace(heightMatch[0], 'height="100%"');
            } else {
                processedSvg = processedSvg.replace(/<svg/, '<svg height="100%"');
            }

            if (!processedSvg.includes('preserveAspectRatio')) {
                processedSvg = processedSvg.replace(/<svg/, '<svg preserveAspectRatio="xMidYMid meet"');
            } else {
                processedSvg = processedSvg.replace(/preserveAspectRatio="[^"]+"/, 'preserveAspectRatio="xMidYMid meet"');
            }

            return processedSvg;
        } catch (err) {
            console.error("Error processing SVG:", err);
            return svgText;
        }
    }, [svgUrl, createLighterColor]); // ✅ colorMap removed from deps — using ref instead

    // Fetch only when URL changes
    useEffect(() => {
        if (!svgUrl) {
            setError("No source provided");
            setIsLoading(false);
            return;
        }

        const fetchSvg = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetch(svgUrl);
                if (!response.ok) throw new Error(`Failed to fetch SVG: ${response.status}`);
                const text = await response.text();
                setRawSvg(text);
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching SVG:", err);
                setError(err);
                setIsLoading(false);
            }
        };

        fetchSvg();
    }, [svgUrl]);

    // Re-process when raw SVG, colors, or colorMap content changes
    useEffect(() => {
        if (!rawSvg) return;

        const { primary, hover, light } = resolvedColors;
        const isValidColor = (val) =>
            val !== undefined &&
            val !== null &&
            val !== '' &&
            val !== 'undefined';

        const primaryColor = isValidColor(primary) ? primary : '#ee2934';
        const hoverColor = isValidColor(hover) ? hover : '#122342';
        const lightColor = isValidColor(light)
            ? light
            : createLighterColor(primaryColor);

        const processed = processSvg(rawSvg, primaryColor, hoverColor, lightColor);
        setSvgContent(processed);

    }, [rawSvg, resolvedColors, colorMapString, processSvg, createLighterColor]);
    // ✅ colorMapString (stable serialized value) instead of colorMap object reference

    const containerStyle = {
        display: "inline-block",
        overflow: "hidden",
        verticalAlign: "middle",
        width: width || "auto",
        height: height || "auto",
        background: "transparent"
    };

    if (svgUrl && svgUrl.includes('error.svg')) {
        containerStyle.overflow = "visible";
        containerStyle.display = "flex";
        containerStyle.justifyContent = "center";
        containerStyle.alignItems = "center";
        if (!width && !height) {
            containerStyle.width = "250px";
            containerStyle.height = "250px";
        }
    }

    if (isLoading) {
        return (
            <div
                className={`${className || ""} bg-gray-100 animate-pulse`}
                style={containerStyle}
                aria-label={`Loading ${alt || "SVG"}`}
            />
        );
    }

    if (error) {
        return (
            <div
                className={`${className || ""} bg-gray-100 flex items-center justify-center text-gray-500`}
                style={containerStyle}
            >
                <span>SVG Error</span>
            </div>
        );
    }

    if (svgContent) {
        return (
            <div
                className={className || ""}
                style={containerStyle}
                dangerouslySetInnerHTML={{ __html: svgContent }}
                aria-label={alt || "SVG Image"}
                role="img"
            />
        );
    }

    return null;
};

export default ThemeSvg;