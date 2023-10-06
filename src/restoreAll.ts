//元に戻す
export const restoreAll = () => parent.document.querySelectorAll(
    'div#root main div:is(#main-content-container,#right-sidebar) span.block-ref>div[blockid][data-checked-reference=true]'
).forEach((element) => restoreReference(element as HTMLElement)
);
//削除する
const restoreReference = (targetRef: HTMLElement) => {
    targetRef.removeAttribute('data-checked-reference');
    //親elementにあるdiv.supportRefを削除する
    targetRef.parentElement?.querySelector('div.supportRef')?.remove();
};
