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
      this[key] = raw[key];
    });
  }
}
