import React, { useState, useEffect } from "react";
import ContactForm from "./ContactForm";
import firebaseDb from "../firebase";
import $ from "jquery";
import alertify from "alertifyjs";
import contextMenu from "jquery-contextmenu";

const Contacts = () => {
  var [contactObjects, setContactObjects] = useState({});
  var [currentId, setCurrentId] = useState("");

  useEffect(() => {
    firebaseDb.child("contacts").on("value", (snapshot) => {
      if (snapshot.val() != null) {
        setContactObjects({
          ...snapshot.val(),
        });
      } else {
        setContactObjects({});
      }
    });
  }, []);

  const addOrEdit = (obj) => {
    if (currentId === "")
      firebaseDb.child("contacts").push(obj, (err) => {
        if (err) console.log(err);
        else setCurrentId("");
      });
    else
      firebaseDb.child(`contacts/${currentId}`).set(obj, (err) => {
        if (err) console.log(err);
        else setCurrentId("");
      });
  };

  const onDelete = (key) => {
    alertify
      .confirm("confirm")
      .set({
        transition: "zoom",
        message: "Transition effect: zoom",
        movable: false,
      })
      .show();

    alertify.confirm(
      "Personel Sil",
      contactObjects[key].fullName + " İsimli Personel Silinecek",
      function () {
        firebaseDb.child(`contacts/${key}`).remove((err) => {
          if (err) console.log(err);
          else setCurrentId("");
        });
        alertify.success(
          contactObjects[key].fullName + " İsimli Personel Silindi"
        );
      },
      function () {}
    );

    // if (window.confirm("Are you sure to delete this record?")) {
    //   firebaseDb.child(`contacts/${key}`).remove((err) => {
    //     if (err) console.log(err);
    //     else setCurrentId("");
    //   });
    // }
  };

  const eda = (id) => {
    // alertify.confirm().setContent(contactObjects[id].fullName).show();
  };

  $(document).on("click contextmenu", "#data tr", function (e) {
    $("#data tr").removeClass("highlighted");
    $(this).addClass("highlighted");
  });

  $.contextMenu({
    selector: "#data tr",
    items: {
      contactObjects: {
        name: "Foo",
        callback: function (id) {
          console.log(contactObjects[id].fullName);
        },
      },
      bar: {
        name: "Bar",
        callback: function (key, opt) {
          alert("Bar!");
        },
      },
    },
  });

  return (
    <div>
      <ContactForm {...{ addOrEdit, currentId, contactObjects }} />

      <table id="data" className="personnelTable">
        <thead>
          <tr>
            <th>TC</th>
            <th>Ad Soyad</th>
            <th>
              <i className="fas fa-camera fa-icon"></i>
            </th>
            <th>Cinsiyet</th>
            <th>Telefon</th>
            <th>E-Mail</th>
            <th>Departman</th>
            <th>Maaş</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {Object.keys(contactObjects).map((id) => {
            return (
              <tr
                key={id}
                onDoubleClick={() => {
                  eda(id);
                }}
              >
                <td>{contactObjects[id].tcNo}</td>
                <td className="textIndent">{contactObjects[id].fullName}</td>
                <td className="center iconSet blue">
                  <i
                    className="fas fa-camera"
                    style={{ cursor: "pointer" }}
                  ></i>
                </td>
                <td className="textIndent">{contactObjects[id].gender}</td>
                <td className="textIndent">{contactObjects[id].phone}</td>
                <td className="textIndent">{contactObjects[id].email}</td>
                <td className="textIndent">{contactObjects[id].department}</td>
                <td className="textIndent">
                  {contactObjects[id].salary + " ₺"}
                </td>
                <td className="center iconSet">
                  <i
                    onClick={() => {
                      setCurrentId(id);
                    }}
                    className="fas fa-user-edit"
                    style={{ cursor: "pointer" }}
                  ></i>

                  <i
                    onClick={() => {
                      onDelete(id);
                    }}
                    className="fas fa-user-times"
                    style={{ cursor: "pointer" }}
                  ></i>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Contacts;
