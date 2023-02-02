import slashify from 'slash';
import type { SSRElement } from '../../@types/astro';
import { appendForwardSlash, removeLeadingForwardSlash, addAssetPrefix } from '../../core/path.js';

function getRootPath(base?: string): string {
	return appendForwardSlash(new URL(base || '/', 'http://localhost/').pathname);
}

function joinToRoot(href: string, base?: string): string {
	const rootPath = getRootPath(base);
	const normalizedHref = slashify(href);
	return appendForwardSlash(rootPath) + removeLeadingForwardSlash(normalizedHref);
}

export function createLinkStylesheetElement(href: string, base?: string, assetPrefix?: (string | undefined)): SSRElement {
	return {
		props: {
			rel: 'stylesheet',
			href: addAssetPrefix(assetPrefix, joinToRoot(href, base)),
		},
		children: '',
	};
}

export function createLinkStylesheetElementSet(hrefs: string[], base?: string, assetPrefix?: (string | undefined)) {
	return new Set<SSRElement>(hrefs.map((href) => createLinkStylesheetElement(href, base, assetPrefix)));
}

export function createModuleScriptElement(
	script: { type: 'inline' | 'external'; value: string },
	base?: string,
	assetPrefix?: (string | undefined)
): SSRElement {
	if (script.type === 'external') {
		return createModuleScriptElementWithSrc(script.value, base, assetPrefix);
	} else {
		return {
			props: {
				type: 'module',
			},
			children: script.value,
		};
	}
}

export function createModuleScriptElementWithSrc(src: string, site?: string, assetPrefix?: (string | undefined)): SSRElement {
	return {
		props: {
			type: 'module',
			src: addAssetPrefix(assetPrefix, joinToRoot(src, site)),
		},
		children: '',
	};
}

export function createModuleScriptElementWithSrcSet(
	srces: string[],
	site?: string,
	assetPrefix?: (string | undefined)
): Set<SSRElement> {
	return new Set<SSRElement>(srces.map((src) => createModuleScriptElementWithSrc(src, site, assetPrefix)));
}

export function createModuleScriptsSet(
	scripts: { type: 'inline' | 'external'; value: string }[],
	base?: string,
	assetPrefix?: (string | undefined)
): Set<SSRElement> {
	return new Set<SSRElement>(scripts.map((script) => createModuleScriptElement(script, base, assetPrefix)));
}
