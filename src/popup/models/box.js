import * as _ from "lodash";
import StreamReader from "../utils/streamReader.js";
import { map } from "rxjs/operators";
import Api from "./api";

export default class Box {
  constructor(htmlElement, id = "1319") {
    this.id = id;
    this.urlActivities =
      "https://book.smartbox.com/fr/catalog/search/activities";
    this.img = htmlElement.querySelector(".box-item__image").src;
    this.title = htmlElement.querySelector(".qa-box-title").innerText;
    this.link = htmlElement.querySelector(".qa-box-title").href;
    this.validate = htmlElement.querySelector(".qa-voucher-status").innerText;
  }

  getActivities() {
    let stream = new StreamReader(
      `${Api.activities}?pim_id=${this.id}&pagesize=200`
    );
    return stream.extractDataToJson().pipe(
      map((data) => {
        return data.items;
      })
    );
  }
}
