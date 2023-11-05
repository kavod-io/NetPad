import {DI} from "aurelia";
import {IMenuItem} from "./imenu-item";
import {System} from "@common";
import {ISettingService, IWindowService} from "@domain";
import {IShortcutManager} from "@application";
import {ITextEditorService} from "@application/editor/text-editor-service";
import {AppUpdateDialog} from "@application/dialogs/app-update-dialog/app-update-dialog";
import {DialogUtil} from "@application/dialogs/dialog-util";

export const IMainMenuService = DI.createInterface<MainMenuService>();

export interface IMainMenuService {
    items: ReadonlyArray<IMenuItem>;

    addItem(item: IMenuItem): void;

    removeItem(item: IMenuItem): void;

    clickMenuItem(item: IMenuItem): Promise<void>;

    clickMenuItem(id: string): Promise<void>;
}

export class MainMenuService implements IMainMenuService {
    private readonly _items: IMenuItem[] = [];

    constructor(
        @ISettingService private readonly settingsService: ISettingService,
        @IShortcutManager private readonly shortcutManager: IShortcutManager,
        @ITextEditorService private readonly textEditorService: ITextEditorService,
        @IWindowService private readonly windowService: IWindowService,
        private readonly dialogUtil: DialogUtil
    ) {
        this._items = [
            {
                text: "File",
                menuItems: [
                    {
                        id: "file.new",
                        text: "New",
                        icon: "add-script-icon",
                        shortcut: this.shortcutManager.getShortcutByName("New"),
                    },
                    {
                        id: "file.goToScript",
                        text: "Go to Script",
                        shortcut: this.shortcutManager.getShortcutByName("Go to Script"),
                    },
                    {
                        isDivider: true
                    },
                    {
                        id: "file.save",
                        text: "Save",
                        icon: "save-icon",
                        shortcut: this.shortcutManager.getShortcutByName("Save"),
                    },
                    {
                        id: "file.saveAll",
                        text: "Save All",
                        icon: "save-icon",
                        shortcut: this.shortcutManager.getShortcutByName("Save All"),
                    },
                    {
                        id: "file.properties",
                        text: "Properties",
                        icon: "properties-icon",
                        shortcut: this.shortcutManager.getShortcutByName("Script Properties"),
                    },
                    {
                        id: "file.close",
                        text: "Close",
                        icon: "close-icon",
                        shortcut: this.shortcutManager.getShortcutByName("Close"),
                    },
                    {
                        isDivider: true
                    },
                    {
                        id: "file.settings",
                        text: "Settings",
                        icon: "settings-icon",
                        shortcut: this.shortcutManager.getShortcutByName("Settings"),
                    },
                    {
                        id: "file.exit",
                        text: "Exit",
                        click: async () => window.close()
                    }
                ]
            },
            {
                text: "Edit",
                menuItems: [
                    {
                        text: "Undo",
                        icon: "undo-icon",
                        click: async () => this.textEditorService.active?.monaco
                            .trigger(null, "undo", null),
                        helpText: "Ctrl + Z"
                    },
                    {
                        text: "Redo",
                        icon: "redo-icon",
                        click: async () => this.textEditorService.active?.monaco
                            .trigger(null, "redo", null),
                        helpText: "Ctrl + Shift + Z"
                    },
                    {
                        isDivider: true
                    },
                    {
                        text: "Cut",
                        icon: "cut-icon",
                        click: async () => this.textEditorService.active?.monaco
                            .trigger(null, "editor.action.clipboardCutAction", null)
                    },
                    {
                        text: "Copy",
                        icon: "copy-icon",
                        click: async () => this.textEditorService.active?.monaco
                            .trigger(null, "editor.action.clipboardCopyAction", null)
                    },
                    {
                        text: "Delete",
                        icon: "backspace-icon",
                        click: async () => this.textEditorService.active?.monaco
                            .trigger(null, "deleteRight", null)
                    },
                    {
                        isDivider: true
                    },
                    {
                        text: "Select All",
                        click: async () => this.textEditorService.active?.monaco
                            .trigger(null, "editor.action.selectAll", null)
                    },
                    {
                        isDivider: true
                    },
                    {
                        id: "edit.find",
                        text: "Find",
                        icon: "search-icon",
                        click: async () => this.textEditorService.active?.monaco
                            .trigger(null, "actions.findWithSelection", null),
                        helpText: "Ctrl + F"
                    },
                    {
                        id: "edit.replace",
                        text: "Replace",
                        click: async () => this.textEditorService.active?.monaco
                            .trigger(null, "editor.action.startFindReplaceAction", null),
                        helpText: "Ctrl + H"
                    },
                    {
                        isDivider: true
                    },
                    {
                        id: "edit.transform1",
                        text: "Transform to Upper/Lower Case",
                        click: async () => this.textEditorService.active?.monaco
                            .trigger(null, "netpad.action.transformToUpperOrLowercase", null),
                        helpText: "Ctrl + Shift + Y"
                    },
                    {
                        id: "edit.transform2",
                        text: "Transform to Upper Case",
                        click: async () => this.textEditorService.active?.monaco
                            .trigger(null, "editor.action.transformToUppercase", null)
                    },
                    {
                        id: "edit.transform3",
                        text: "Transform to Lower Case",
                        click: async () => this.textEditorService.active?.monaco
                            .trigger(null, "editor.action.transformToLowercase", null)
                    },
                    {
                        id: "edit.transform4",
                        text: "Transform to Title Case",
                        click: async () => this.textEditorService.active?.monaco
                            .trigger(null, "editor.action.transformToTitlecase", null)
                    },
                    {
                        id: "edit.transform5",
                        text: "Transform to Kebab Case",
                        click: async () => this.textEditorService.active?.monaco
                            .trigger(null, "editor.action.transformToKebabcase", null)
                    },
                    {
                        id: "edit.transform6",
                        text: "Transform to Snake Case",
                        click: async () => this.textEditorService.active?.monaco
                            .trigger(null, "editor.action.transformToSnakecase", null)
                    },
                    {
                        isDivider: true
                    },
                    {
                        id: "edit.toggleLineComment",
                        text: "Toggle Line Comment",
                        click: async () => this.textEditorService.active?.monaco
                            .trigger(null, "editor.action.commentLine", null),
                        helpText: "Ctrl + /"
                    },
                    {
                        id: "edit.toggleBlockComment",
                        text: "Toggle Block Comment",
                        click: async () => this.textEditorService.active?.monaco
                            .trigger(null, "editor.action.blockComment", null),
                        helpText: "Ctrl + Shift + A"
                    }
                ]
            },
            {
                text: "View",
                menuItems: [
                    {
                        id: "view.output",
                        text: "Output",
                        icon: "output-icon",
                        shortcut: this.shortcutManager.getShortcutByName("Output"),
                    },
                    {
                        id: "view.explorer",
                        text: "Explorer",
                        icon: "explorer-icon",
                        shortcut: this.shortcutManager.getShortcutByName("Explorer"),
                    },
                    {
                        id: "view.namespaces",
                        text: "Namespaces",
                        icon: "namespaces-icon",
                        shortcut: this.shortcutManager.getShortcutByName("Namespaces"),
                    },
                    {
                        isDivider: true
                    },
                    {
                        text: "Reload",
                        shortcut: this.shortcutManager.getShortcutByName("Reload"),
                    },
                    {
                        text: "Toggle Developer Tools",
                        click: async () => this.windowService.toggleDeveloperTools(),
                        helpText: "Ctrl + Shift + I",
                    },
                    {
                        isDivider: true
                    },
                    {
                        text: "Zoom In",
                        icon: "zoom-in-icon",
                        helpText: "Ctrl + +",
                    },
                    {
                        text: "Zoom Out",
                        icon: "zoom-out-icon",
                        helpText: "Ctrl + -",
                    },
                    {
                        text: "Reset Zoom",
                        helpText: "Ctrl + 0",
                    },
                    {
                        text: "Toggle Full Screen",
                        click: async () => this.windowService.toggleFullScreen(),
                        helpText: "F11",
                    },
                ]
            },
            {
                text: "Help",
                menuItems: [
                    {
                        id: "help.about",
                        text: "About",
                        icon: "star-icon",
                        click: async () => await this.settingsService.openSettingsWindow("about")
                    },
                    {
                        id: "help.checkForUpdates",
                        text: "Check for Updates",
                        icon: "app-update-icon",
                        click: async () => await this.dialogUtil.toggle(AppUpdateDialog)
                    },
                    {
                        id: "help.github",
                        text: "GitHub",
                        icon: "github-icon",
                        click: async () => System.openUrlInBrowser("https://github.com/tareqimbasher/NetPad")
                    },
                    {
                        id: "help.searchIssues",
                        text: "Search Issues",
                        icon: "github-icon",
                        click: async () => System.openUrlInBrowser("https://github.com/tareqimbasher/NetPad/issues")
                    },
                ]
            }
        ];
    }

    public get items(): ReadonlyArray<IMenuItem> {
        return this._items;
    }

    public addItem(item: IMenuItem) {
        this._items.push(item);
    }

    public removeItem(item: IMenuItem) {
        const ix = this._items.indexOf(item);
        if (ix >= 0) this._items.splice(ix, 1);
    }

    public async clickMenuItem(itemOrId: IMenuItem | string) {
        let menuItem: IMenuItem | undefined;

        if (typeof itemOrId === "object") {
            menuItem = itemOrId;
        } else {
            menuItem = this.find(this._items, item => item.id === itemOrId);
        }

        if (!menuItem) return;

        if (menuItem.click) {
            await menuItem.click();
        } else if (menuItem.shortcut) {
            this.shortcutManager.executeShortcut(menuItem.shortcut);
        }
    }

    private filter(items: IMenuItem[], predicate: (item: IMenuItem) => boolean) {
        const results: IMenuItem[] = [];

        this.walkItems(items, item => {
            if (predicate(item)) results.push(item);
            return true;
        });

        return results;
    }

    private find(items: IMenuItem[], predicate: (item: IMenuItem) => boolean) {
        let result: IMenuItem | undefined;

        this.walkItems(items, item => {
            if (predicate(item)) {
                result = item;
                return false;
            }

            return true;
        });

        return result;
    }

    private walkItems(items: IMenuItem[], action: (item: IMenuItem) => boolean) {
        for (const item of items) {
            if (!action(item)) return;

            if (item.menuItems && item.menuItems.length) {
                this.walkItems(item.menuItems, action);
            }
        }
    }
}
