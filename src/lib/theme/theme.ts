export type Appearance = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const APPEARANCE_STORAGE_KEY = "lume-appearance";

/**
 * Runs synchronously in <head> before first paint, so a stored or system
 * preference never flashes the wrong theme. Kept dependency-free and tiny.
 */
export const themeInitScript = `(function(){try{var d=document.documentElement;d.classList.add('js');var p=localStorage.getItem('${APPEARANCE_STORAGE_KEY}');if(p!=='light'&&p!=='dark')p='system';var t=p==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):p;d.setAttribute('data-theme',t);d.setAttribute('data-appearance',p);}catch(e){}})();`;
