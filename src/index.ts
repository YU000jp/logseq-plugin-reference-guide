import '@logseq/libs'; //https://plugins-doc.logseq.com/
import { LSPluginBaseInfo, SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user';
import { setup as l10nSetup } from "logseq-l10n"; //https://github.com/sethyuan/logseq-l10n
import ja from "./translations/ja.json";

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

    logseq.App.onSidebarVisibleChanged(async ({ visible }) => {
        if (visible === true) {
            observer.disconnect();
            observerBoth();
        }
    });

    setTimeout(() => observerBoth(), 500);

    logseq.onSettingsChanged((newSet: LSPluginBaseInfo['settings'], oldSet: LSPluginBaseInfo['settings']) => {
        //更新されたら
        if (newSet !== oldSet) restoreAll();
    });
    logseq.beforeunload(async () => restoreAll());

};/* end_main */


const callback = () => {//callback関数
    observer.disconnect();
    refQuerySelectorAll();
    setTimeout(() => observerBoth(), 1000);
}

const observer = new MutationObserver(callback);// コールバック関数に結びつけられたオブザーバーのインスタンスを生成

//セレクターに一致するエレメントに処理をおこなう
let processingQuery: boolean = false;
const refQuerySelectorAll = async (): Promise<void> => {
    if (processingQuery === true) return;
    processingQuery = true;
    parent.document.querySelectorAll(
        'div#root main div:is(#main-content-container,#right-sidebar) span.block-ref>div[blockid]:not([data-checked-reference=true])'
    ).forEach(
        (element) => everyReferences(element as HTMLElement)
    );
    processingQuery = false;
};


const observerBoth = () => {//対象ノードの監視スタート
    observer.observe(
        parent.document.getElementById("main-content-container") as HTMLDivElement, {
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
    });
    observer.observe(
        parent.document.getElementById("right-sidebar") as HTMLDivElement, {
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
    });
};


const everyReferences = (refBlock: HTMLElement) => {
    console.log(refBlock);

    refBlock.dataset.checkedReference = "true";
};


//元に戻す
const restoreAll = () => parent.document.querySelectorAll(
    'div#root main div:is(#main-content-container,#right-sidebar) span.block-ref>div[blockid][data-checked-reference=true]'
).forEach((element) =>
    restoreReference(element as HTMLElement)
);

const restoreReference = (namespaceRef: HTMLElement) => {

};


/* user setting */
// https://logseq.github.io/plugins/types/SettingSchemaDesc.html
const settingsTemplate = (): SettingSchemaDesc[] => [

];

logseq.ready(main).catch(console.error);