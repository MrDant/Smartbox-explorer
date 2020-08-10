export default class ChromeWindow {
  static focusTo(url) {
    chrome.windows.getAll({ populate: true }, function(windows) {
      let existing_tab = null;
      for (let i in windows) {
        let tabs = windows[i].tabs;
        for (let j in tabs) {
          let tab = tabs[j];
          if (tab.url == url) {
            existing_tab = tab;
            break;
          }
        }
      }
      if (existing_tab) {
        chrome.tabs.update(existing_tab.id, { selected: true });
      } else {
        chrome.tabs.create({ url: url, selected: true });
      }
    });
  }
}
