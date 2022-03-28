import { ROUTES_PATH } from '../constants/routes.js'
import { formatDate, formatStatus } from "../app/format.js"
import Logout from "./Logout.js"

export default class {
  constructor({ document, onNavigate, firestore, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.firestore = firestore
    const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`)
    if (buttonNewBill) buttonNewBill.addEventListener('click', this.handleClickNewBill)
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`)
    if (iconEye) iconEye.forEach(icon => {
      icon.addEventListener('click', (e) => this.handleClickIconEye(icon))
    })
    new Logout({ document, localStorage, onNavigate })
  }

  handleClickNewBill = e => {
    this.onNavigate(ROUTES_PATH['NewBill'])
  }

  handleClickIconEye = (icon) => {
    const billUrl = icon.getAttribute("data-bill-url")
    const imgWidth = Math.floor($('#modaleFile').width() * 0.5)
    
    /*
    if (billUrl === null) {
      console.log("No image");
      billUrl = "https://firebasestorage.googleapis.com/v0/b/billable-677b6.appspot.com/o/justificatifs%2Funnamed.jpg?alt=media&token=5de56d8e-7859-4701-9f7f-d879fd5441f6"
    }*/

    $('#modaleFile').find(".modal-body").html(`<div style='text-align: center;'><img width=${imgWidth} src=${billUrl} data-testid="bill-img" /></div>`)
    $('#modaleFile').modal('show')
  }

  // not need to cover this function by tests
  getBills = () => {
    const userEmail = localStorage.getItem('user') ?
      JSON.parse(localStorage.getItem('user')).email : ""
    if (this.firestore) {
      return this.firestore
      .bills()
      .get()
      .then(snapshot => {
        const bills = snapshot.docs
          .map(doc => {
            try {
              return {
                ...doc.data(),
                date: formatDate(doc.data().date),
                status: formatStatus(doc.data().status)
              }
            } catch(e) {
              // if for some reason, corrupted data was introduced, we manage here failing formatDate function
              // log the error and return unformatted date in that case
              console.log(e,'for',doc.data())
              return {
                ...doc.data(),
                date: formatDate('2021-06-09'),
                status: formatStatus(doc.data().status)
              }
            }
          })
          .filter(bill => bill.email === userEmail)
          console.log('length', bills.length)
        return bills
      })
      .catch(error => error)
    }
  }
}