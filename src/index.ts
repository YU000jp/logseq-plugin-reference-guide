import '@logseq/libs'; //https://plugins-doc.logseq.com/
import { LSPluginBaseInfo } from '@logseq/libs/dist/LSPlugin.user';
import { setup as l10nSetup } from "logseq-l10n"; //https://github.com/sethyuan/logseq-l10n
import ja from "./translations/ja.json";
import CSS from './style.css?inline';
import { settingsTemplate } from './settings';
import { restoreAll } from './restoreAll';
import { observer, observerBoth, refQuerySelectorAll } from './observer';

/* main */
const main = () => {
    (async () => {
        try {
            await l10nSetup({ builtinTranslations: { ja } });
        } finally {
            /* user settings */
            logseq.useSettingsSchema(settingsTemplate());
            if (!logseq.settings) setTimeout(() => logseq.showSettingsUI(), 300);
        }
    })();

    logseq.provideStyle(CSS);

    logseq.App.onSidebarVisibleChanged(async ({ visible }) => {
        if (visible === true) {
            observer.disconnect();
            observerBoth();
        }
    });

    setTimeout(() => observerBoth(), 500);

    logseq.onSettingsChanged((newSet: LSPluginBaseInfo['settings'], oldSet: LSPluginBaseInfo['settings']) => {
        //更新されたら
        if (newSet !== oldSet) {
            restoreAll();
            refQuerySelectorAll();
        }
    });
    logseq.beforeunload(async () => restoreAll());

};/* end_main */


logseq.ready(main).catch(console.error);