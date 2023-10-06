import { everyReferences } from './supportReference';

const callback = () => {
    observer.disconnect();
    refQuerySelectorAll();
    setTimeout(() => observerBoth(), 1000);
};
export const observer = new MutationObserver(callback); // コールバック関数に結びつけられたオブザーバーのインスタンスを生成

//セレクターに一致するエレメントに処理をおこなう
let processingQuery: boolean = false;
export const refQuerySelectorAll = async (): Promise<void> => {
    if (processingQuery === true) return;
    processingQuery = true;
    parent.document.querySelectorAll(
        'div#root main div:is(#main-content-container,#right-sidebar) span.block-ref>div[blockid]:not([data-checked-reference=true])'
    ).forEach(
        (element) => everyReferences(element as HTMLElement)
    );
    processingQuery = false;
};
export const observerBoth = () => {
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
