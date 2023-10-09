import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user';
import { t } from 'logseq-l10n';

export const settingsTemplate = (): SettingSchemaDesc[] => [
    {//子ブロックの数を求める
        key: "blockChildrenLength",
        type: "boolean",
        title: t("Enable the block children length"),
        default: true,
        description: "default: true",
    },
    {//子ブロックのバイト数を求める
        key: "blockChildrenByteLength",
        type: "boolean",
        title: t("Enable the block children byte length"),
        default: true,
        description: "default: true",
    },
    {//子ブロックの行数を求める
        key: "blockChildrenLineLength",
        type: "boolean",
        title: t("Enable the block children line length"),
        default: true,
        description: "default: true",
    },
    {//親ページ名を表示する
        key: "showParentPageName",
        type: "boolean",
        title: t("Enable the parent page name"),
        default: true,
        description: "default: true",
    }


];
