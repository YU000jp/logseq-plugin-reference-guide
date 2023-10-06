import { BlockEntity } from '@logseq/libs/dist/LSPlugin.user';

const getBlockChildLength = (childChildren: BlockEntity[], blockChildrenLength: number): number => {
    for (const childChild of childChildren) {
        const childChildChildren = childChild.children as BlockEntity[];
        if (childChildChildren.length > 0) {
            blockChildrenLength += childChildChildren.length;
            blockChildrenLength = getBlockChildLength(childChildChildren, blockChildrenLength);
        }
    }
    return blockChildrenLength;

};

const getBlockChildByteLength = (childChildren: BlockEntity[], blockChildrenByteLength: number): number => {
    for (const childChild of childChildren) {
        const childChildChildren = childChild.children as BlockEntity[];
        if (childChildChildren.length > 0) {
            blockChildrenByteLength += childChildChildren.length;
            blockChildrenByteLength = getBlockChildByteLength(childChildChildren, blockChildrenByteLength);
        }
    }
    return blockChildrenByteLength;

};

const getBlockChildLineLength = (childChildren: BlockEntity[], blockChildrenLineLength: number): number => {
    for (const childChild of childChildren) {
        const childChildChildren = childChild.children as BlockEntity[];
        if (childChildChildren.length > 0) {
            blockChildrenLineLength += childChildChildren.length;
            blockChildrenLineLength = getBlockChildLineLength(childChildChildren, blockChildrenLineLength);
        }
    }
    return blockChildrenLineLength;
};

//sample: <div id="block-content-ee829568-6e3c-42fd-8db9-ef30dbe40c1b" blockid="ee829568-6e3c-42fd-8db9-ef30dbe40c1b" data-type="default" class="block-content inline" style="width: 100%;" data-checked-reference="true"><div class="flex flex-row justify-between block-content-inner"><div class="flex-1 w-full"><span class="inline">場内</span></div></div></div>
export const everyReferences = async (refBlock: HTMLElement) => {
    if (!refBlock || refBlock.dataset.checkedReference === "true") return;
    const blockId = refBlock.getAttribute("blockid");
    if (!blockId) return;
    const block = await logseq.Editor.getBlock(blockId, { includeChildren: true }) as BlockEntity | null;
    if (!block) return;
    //refBlockの親エレメントに追加する
    const supportRef = document.createElement("div");
    supportRef.classList.add("supportRef");
    //spanエレメントにブロック情報を追加する
    const spanEle: HTMLSpanElement = document.createElement("span");
    spanEle.classList.add("inline");

    //リンクのサイズを見積もる
    //すべてのブロック、行数、またはバイトサイズの(再帰的な)合計
    //子ブロック>子ブロック>子ブロック....の処理

    const blockChildren = block.children as BlockEntity[];
    let blockChildrenLength = blockChildren.length;//ブロックの数を求める
    let blockChildrenByteLength = block.content.length;//ブロックのバイト数を求める
    let blockChildrenLineLength = block.content.split("\n").length;//子ブロックの行数を求める
    if (blockChildrenLength > 0) {
        for (const child of blockChildren) { //子ブロックの処理
            //子ブロックの子ブロックの数を求める
            const childChildren = child.children as BlockEntity[];
            //さらに子ブロックがある場合
            if (childChildren.length > 0) {
                //子ブロックの数を足す
                blockChildrenLength += childChildren.length;
                //子ブロックのバイト数を足す
                blockChildrenByteLength += child.content.length;
                //子ブロックの行数を足す
                blockChildrenLineLength += child.content.split("\n").length;
                //子ブロックの子ブロックの子ブロックの数を求める
                blockChildrenLength = getBlockChildLength(childChildren, blockChildrenLength);
                //子ブロックの子ブロックの子ブロックのバイト数を求める
                blockChildrenByteLength = getBlockChildByteLength(childChildren, blockChildrenByteLength);
                //子ブロックの子ブロックの子ブロックの行数を求める
                blockChildrenLineLength = getBlockChildLineLength(childChildren, blockChildrenLineLength);
            }
        }
    }



    spanEle.innerText = `${(logseq.settings!.blockChildrenLength === true
        || logseq.settings!.blockChildrenByteLength === true
        || logseq.settings!.blockChildrenLineLength === true) ?
        `ref (count: ` : ""
        }${(logseq.settings!.blockChildrenLength === false) ?
            "" : `${blockChildrenLength} block${blockChildrenLength === 1 ? "," : "s,"
            }`}${(logseq.settings!.blockChildrenByteLength === false) ?
                "" : ` ${blockChildrenByteLength} byte${blockChildrenByteLength === 1 ? "," : "s,"
                }`}${(logseq.settings!.blockChildrenLineLength === false) ?
                    "" : ` ${blockChildrenLineLength} line${blockChildrenLineLength === 1 ? "" : "s"
                    }`}${(logseq.settings!.blockChildrenLength === true
                        || logseq.settings!.blockChildrenByteLength === true
                        || logseq.settings!.blockChildrenLineLength === true) ?
                        `)` : ""
        }`;

    if (block.page.id && logseq.settings!.showParentPageName === true) {
        const anchorEle: HTMLAnchorElement = document.createElement("a");
        anchorEle.innerText = ` from: [[${block.page.originalName}]]`;
        spanEle.appendChild(anchorEle);
    }
    supportRef.appendChild(spanEle);
    refBlock.parentElement?.appendChild(supportRef);
    refBlock.dataset.checkedReference = "true";
};

