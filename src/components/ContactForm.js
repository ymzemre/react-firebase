import React, { useState, useEffect } from "react";
import "./ContactForm.css";
import alertify from "alertifyjs";
// import $ from "jquery";

const ContactForm = (props) => {
  const initialFieldValues = {
    tcNo: "",
    fullName: "",
    gender: "",
    phone: "",
    email: "",
    department: "",
    salary: "",
  };

  var [values, setValues] = useState(initialFieldValues);

  useEffect(() => {
    if (props.currentId === "") setValues({ ...initialFieldValues });
    else
      setValues({
        ...props.contactObjects[props.currentId],
      });
  }, [props.currentId, props.contactObjects]);

  const handleInputChange = (e) => {
    var { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });
  };

  alertify.set("notifier", "position", "top-right");
  // alertify.set("notifier", "delay", 10000);
  const handleFormSubmit = (e) => {
    e.preventDefault();

    const formValidation =
      values.tcNo.trim() === "" ||
      values.fullName.trim() === "" ||
      values.gender.trim() === "" ||
      values.phone.trim() === "" ||
      values.email.trim() === "" ||
      values.department.trim() === "" ||
      values.salary.trim() === "";

    const formValidationtcNoNan = isNaN(values.tcNo);
    const formValidationphoneNan = isNaN(values.phone);
    const formValidationsalaryNan = isNaN(values.salary);

    if (formValidation) {
      alertify.error("Boş Alan Bırakmayın !");
    } else if (formValidationtcNoNan) {
      alertify.error("Lütfen TC Alanına Sayı Girin !");
    } else if (formValidationphoneNan) {
      alertify.error("Lütfen TELEFON Alanına Sayı Girin !");
    } else if (formValidationsalaryNan) {
      alertify.error("Lütfen MAAŞ Alanına Sayı Girin !");
    } else {
      props.addOrEdit(values);
      const addOrEditAlert =
        props.currentId === ""
          ? alertify.success("Personel Eklendi")
          : alertify.success(
              props.contactObjects[props.currentId].fullName +
                " İsimli Personel Güncellendi"
            );
    }
  };

  return (
    <div className="noluki">
      <span className="form-name">Personel Ekle</span>

      <form
        id="nol"
        autoComplete="off"
        onSubmit={handleFormSubmit}
        className="arka"
      >
        <div className="mokoko">
          <div class="field-group">
            <label htmlFor="tcNo" className="label">
              TC
            </label>
            <div class="field">
              <input
                className="deneme"
                name="tcNo"
                value={values.tcNo}
                maxLength="11"
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div class="field-group">
            <label htmlFor="fullName" className="label">
              Ad Soyad
            </label>
            <div class="field">
              <input
                className="deneme"
                id="phone"
                name="fullName"
                value={values.fullName}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div class="field-group">
            <label htmlFor="gender" className="label">
              Cinsiyet
            </label>
            <div class="field">
              <input
                className="deneme"
                name="gender"
                value={values.gender}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div class="field-group">
            <label className="label">Telefon</label>
            <div class="field">
              <input
                className="deneme"
                name="phone"
                value={values.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div class="field-group">
            <label className="label">E-Mail</label>
            <div class="field">
              <input
                // type="email"
                className="deneme"
                name="email"
                value={values.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div class="field-group">
            <label className="label">Departman</label>
            <div class="field">
              <input
                className="deneme"
                name="department"
                value={values.department}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div class="field-group">
            <label className="label">Maaş</label>
            <div class="field">
              <input
                className="deneme"
                name="salary"
                value={values.salary}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="ebut">
          <div class="field-group">
            <div class="field">
              <button
                type="reset"
                className="clearButton form-button"
                value="Temizle"
              >
                <i className="fas fa-times fa-icon"></i> Temizle
              </button>
            </div>
          </div>

          <div class="field-group">
            <div class="field">
              <button className="addButton form-button" type="submit">
                <i className="fas fa-check fa-icon"></i>
                {props.currentId === "" ? "  Kaydet" : "  Güncelle"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
