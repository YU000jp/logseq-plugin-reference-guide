import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user';

export const settingsTemplate = (): SettingSchemaDesc[] => [
    {//子ブロックの数を求める
        key: "blockChildrenLength",
        type: "boolean",
        title: "Enable the block children length",
        default: true,
        description: "default: true",
    },
    {//子ブロックのバイト数を求める
        key: "blockChildrenByteLength",
        type: "boolean",
        title: "Enable the block children byte length",
        default: true,
        description: "default: true",
    },
    {//子ブロックの行数を求める
        key: "blockChildrenLineLength",
        type: "boolean",
        title: "Enable the block children line length",
        default: true,
        description: "default: true",
    },
    {//親ページ名を表示する
        key: "showParentPageName",
        type: "boolean",
        title: "Enable the parent page name",
        default: true,
        description: "default: true",
    }


];
