/* eslint-disable no-mixed-spaces-and-tabs */
import { App, Plugin, PluginSettingTab, Setting } from "obsidian";

type PluginSettings = Record<
  string,
  {
    pattern: string;
    link: string;
  }
>;

const DEFAULT_SETTINGS: PluginSettings = {};

export default class AutoLinkingPlugin extends Plugin {
  settings: PluginSettings;

  async onload() {
    await this.loadSettings();

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new SettingTab(this.app, this));

    this.registerMarkdownPostProcessor((el: HTMLElement) => {
      Object.values(this.settings)
        .filter(({ pattern, link }) => pattern && link)
        .forEach(({ pattern, link }) => {
          el.innerHTML = el.innerHTML.replace(
            new RegExp(pattern, "g"),
            (value) => {
              const pattern = value.replace(/<[^>]*>/g, ""); // Remove any lingering HTML tags
              return `<a href="${link.replace(
                "{pattern}",
                pattern
              )}" target="_blank" class="external-link">${pattern}</a>`;
            }
          );
        });
    });
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class SettingTab extends PluginSettingTab {
  plugin: AutoLinkingPlugin;

  constructor(app: App, plugin: AutoLinkingPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h2", { text: "Auto-Linking Settings" });

    let newSettingName = "";
    new Setting(containerEl)
      .setName("Add New Pattern")
      .addText((text) => {
        text.inputEl.style.marginRight = "6px";
        text.setPlaceholder("Label").onChange((value) => {
          newSettingName = value;
        });
      })
      .addButton((button) => {
        button.setButtonText("+").onClick(async () => {
          if (!newSettingName) {
            return;
          }
          this.plugin.settings = {
            ...this.plugin.settings,
            [newSettingName]: {
              pattern: "",
              link: "",
            },
          };
          await this.plugin.saveSettings();
          this.display();
        });
      });
    Object.keys(this.plugin.settings).forEach((key) => {
      new Setting(containerEl)
        .setName(key)
        .addText((text) => {
          text.inputEl.style.marginRight = "6px";
          text
            .setPlaceholder("Pattern")
            .setValue(this.plugin.settings[key].pattern)
            .onChange(async (value) => {
              this.plugin.settings[key].pattern = value;
              await this.plugin.saveSettings();
            });
        })
        .addText((text) => {
          text.inputEl.style.marginRight = "6px";
          text
            .setPlaceholder("Link")
            .setValue(this.plugin.settings[key].link)
            .onChange(async (value) => {
              this.plugin.settings[key].link = value;
              await this.plugin.saveSettings();
            });
        })
        .addButton((button) => {
          button.setButtonText("-").onClick(async () => {
            this.plugin.settings = Object.keys(this.plugin.settings)
              .filter((settingsKey) => settingsKey !== key)
              .reduce(
                (settings, settingsKey) => ({
                  ...settings,
                  [settingsKey]: this.plugin.settings[settingsKey],
                }),
                {}
              );
            await this.plugin.saveSettings();
            this.display();
          });
        });
    });
  }
}
