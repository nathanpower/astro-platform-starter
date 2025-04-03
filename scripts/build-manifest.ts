import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

type Assets = {
    styles: string[];
    scripts: string[];
};

type AppName = 'cta' | 'consent';

export type Manifest = Record<AppName, { assets: Assets }>;

/*
 * This script builds the manifest for the app.
 * It gets the latest versions of the following packages from npm:
 *  - @wf-embedded/cta
 *  - @wf-embedded/consent
 * Then it uses these version to create script URLs for jsdeliver
 * The styles will always use https://cdn.jsdelivr.net/npm/@mantine/core@7.17.2/styles.layer.css
 *
 */

const execAsync = promisify(exec);

const getLatestVersion = async (packageName: string) => {
    const { stdout } = await execAsync(`npm show ${packageName} version`);
    return stdout.trim();
};

const getLatestVersions = async () => {
    const ctaVersion = await getLatestVersion('@wf-embedded/cta');
    const consentVersion = await getLatestVersion('@wf-embedded/consent');
    return { ctaVersion, consentVersion };
};

const buildManifest = async () => {
    const { ctaVersion, consentVersion } = await getLatestVersions();
    const manifest: Manifest = {
        cta: {
            assets: {
                styles: ['https://cdn.jsdelivr.net/npm/@mantine/core@7.17.2/styles.layer.css'],
                scripts: [`https://cdn.jsdelivr.net/npm/@wf-embedded/cta@${ctaVersion}/dist/wf-embedded-cta.umd.js`]
            }
        },
        consent: {
            assets: {
                styles: ['https://cdn.jsdelivr.net/npm/@mantine/core@7.17.2/styles.layer.css'],
                scripts: [`https://cdn.jsdelivr.net/npm/@wf-embedded/consent@${consentVersion}/dist/wf-embedded-consent.umd.js`]
            }
        }
    };
    return manifest;
};

const writeManifest = async (manifest: Manifest) => {
    fs.writeFileSync('public/manifest.json', JSON.stringify(manifest, null, 2));
};

const manifest = await buildManifest();
writeManifest(manifest);
