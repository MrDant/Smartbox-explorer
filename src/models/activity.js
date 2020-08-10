export default class Activity {
  constructor(raw) {
    const keys = [
      "city",
      "experience_id",
      "gps_latitude",
      "gps_longitude",
      "id",
      "image_gallery",
      "img",
      "name",
      "nb_personnes",
      "partner_name",
      "region",
      "reservable",
      "short_description",
      "subtitle",
      "url",
    ];
    keys.forEach((key) => {
<<<<<<< HEAD
      if (typeof raw[key] == "string") {
        this[key] = raw[key].replace(/[^A-zÀ-ú ()0-9\-\/’'\.:]/g, "");
      } else {
        this[key] = raw[key];
      }
=======
      this[key] = raw[key];
>>>>>>> 2efe523... update structure
    });
  }
}
