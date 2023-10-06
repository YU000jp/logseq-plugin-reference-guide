import { BlockEntity } from '@logseq/libs/dist/LSPlugin.user';


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
    const blockChildrenEntity = block.children as BlockEntity[];
    let blockChildrenLength = blockChildrenEntity.length;//対象ブロックがもつ子ブロックの数を求める
    let blockChildrenByteLength = block.content.length;//対象ブロックのstringバイト数を求める
    let blockChildrenLineLength = block.content.split("\n").length - 1;//対象ブロックの行数を求める //必ず1行以上あるので-1する
    if (blockChildrenLength > 0) ({ blockChildrenByteLength, blockChildrenLineLength, blockChildrenLength } = getChildLength(blockChildrenEntity, blockChildrenByteLength, blockChildrenLineLength, blockChildrenLength));



    spanEle.innerText = `${(logseq.settings!.blockChildrenLength === true
        || logseq.settings!.blockChildrenByteLength === true
        || logseq.settings!.blockChildrenLineLength === true) ?
        `count (` : ""
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
        const notAnchorEle: HTMLSpanElement = document.createElement("span");//リファレンスのアンカー内なのでリンクにできない
        notAnchorEle.innerText = ` from: [[${block.page.originalName}]]`;//元のページ名
        spanEle.appendChild(notAnchorEle);
    }
    supportRef.appendChild(spanEle);
    refBlock.parentElement?.appendChild(supportRef);
    refBlock.dataset.checkedReference = "true";
    supportRef.title = "By \"Reference guide\" plugin";
};

const getChildLength = (blockChildrenEntity: BlockEntity[], blockChildrenByteLength: number, blockChildrenLineLength: number, blockChildrenLength: number) => {
    for (const child of blockChildrenEntity) { //子ブロックごとの処理
        blockChildrenByteLength += child.content.length; //子ブロックのstringバイト数を足す
        blockChildrenLineLength += child.content.split("\n").length; //子ブロックの行数を足す
        const childChildrenEntity = child.children as BlockEntity[]; //子ブロックの子ブロックの数を求める
        if (childChildrenEntity.length > 0) { //さらに子ブロックがある場合
            blockChildrenLength += childChildrenEntity.length; //子ブロックの子ブロックの数を足す
            ({ blockChildrenByteLength, blockChildrenLineLength, blockChildrenLength } = getChildLength(childChildrenEntity, blockChildrenByteLength, blockChildrenLineLength, blockChildrenLength));
        }
    }
    return { blockChildrenByteLength, blockChildrenLineLength, blockChildrenLength };
}

