import React, { useState, useEffect } from "react";
import PersonnelForm from "../personnelForm/PersonnelForm";
import firebaseDb from "../../firebase";
import $ from "jquery";
import alertify from "alertifyjs";
import contextMenu from "jquery-contextmenu";
import "./personnelList.css";
import "../../css/alert.css";

const PersonnelList = () => {
  var [PersonnelObjects, setPersonnelObjects] = useState({});
  var [currentId, setCurrentId] = useState("");

  useEffect(() => {
    firebaseDb.child("personnel-demo").on("value", (snapshot) => {
      if (snapshot.val() != null) {
        setPersonnelObjects({
          ...snapshot.val(),
        });
      } else {
        setPersonnelObjects({});
      }
    });
  }, []);

  const addOrEdit = (obj) => {
    if (currentId === "")
      firebaseDb.child("personnel-demo").push(obj, (err) => {
        if (err) console.log(err);
        else setCurrentId("");
      });
    else
      firebaseDb.child(`personnel-demo/${currentId}`).set(obj, (err) => {
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
      PersonnelObjects[key].fullName + " İsimli Personel Silinecek",
      function () {
        firebaseDb.child(`personnel-demo/${key}`).remove((err) => {
          if (err) console.log(err);
          else setCurrentId("");
        });
        alertify.success(
          PersonnelObjects[key].fullName + " İsimli Personel Silindi"
        );
      },
      function () {}
    );

    // if (window.confirm("Are you sure to delete this record?")) {
    //   firebaseDb.child(`personnel/${key}`).remove((err) => {
    //     if (err) console.log(err);
    //     else setCurrentId("");
    //   });
    // }
  };

  $(document).on("click contextmenu", "#data tr", function (e) {
    $("#data tr").removeClass("highlighted");
    $(this).addClass("highlighted");
  });

  $.contextMenu({
    selector: "#data tr",
    items: {
      PersonnelObjects: {
        name: "Foo",
        callback: function (id) {
          console.log(PersonnelObjects[id].fullName);
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
      <PersonnelForm {...{ addOrEdit, currentId, PersonnelObjects }} />

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
          {Object.keys(PersonnelObjects).map((id) => {
            return (
              <tr key={id}>
                <td>{PersonnelObjects[id].tcNo}</td>
                <td className="textIndent">{PersonnelObjects[id].fullName}</td>
                <td className="center iconSet blue">
                  <i
                    className="fas fa-camera"
                    style={{ cursor: "pointer" }}
                  ></i>
                </td>
                <td className="textIndent">{PersonnelObjects[id].gender}</td>
                <td className="textIndent">{PersonnelObjects[id].phone}</td>
                <td className="textIndent">{PersonnelObjects[id].email}</td>
                <td className="textIndent">
                  {PersonnelObjects[id].department}
                </td>
                <td className="textIndent">
                  {PersonnelObjects[id].salary + " ₺"}
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

export default PersonnelList;
