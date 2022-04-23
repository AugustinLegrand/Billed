import { fireEvent, getByTestId, getByText, screen } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import { localStorageMock } from '../__mocks__/localStorage'
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH } from '../constants/routes'
import BillsUI from "../views/BillsUI.js"
import Bills from '../containers/Bills'
import Firestore from '../app/Firestore'
import Router from "../app/Router"

Object.defineProperty(window, 'localStorage', { value: localStorageMock })
window.localStorage.setItem('user', JSON.stringify({
  type: 'Employee'
}))

const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({ pathname })
}


describe("Given I am connected as an employee", () => {

  describe("When I am on Bills Page", () => {

    test('Then, I should test bill icon in vertical layout should be highlighted', () => {

      jest.mock('../app/Firestore')
      Firestore.bills = () => ({
        bills,
        get: jest.fn().mockResolvedValue()
      })

      const pathname = ROUTES_PATH["Bills"]

      Object.defineProperty(window, "location", {
        value: {
          hash: pathname
        }
      });

      document.body.innerHTML = `<div id="root"></div>`

      Router()
      expect(
        screen.getByTestId("icon-window").classList.contains("active-icon")
      ).toBe(true)

    })

    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort((a, b) => b - a)
      expect(dates).toEqual(datesSorted)
    })

    test("When I click on the icon eye", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const billsContainer = new Bills({
        document, onNavigate, firestore: null, localStorage: window.localStorage
      })

      const modale = document.getElementById('modaleFile')
      $.fn.modal = jest.fn(() => modale.classList.add('show'))
      const handleClickIconEye = jest.fn(() => billsContainer.handleClickIconEye)
      const iconEye = screen.getAllByTestId('icon-eye')[1]

      iconEye.addEventListener('click', handleClickIconEye)
      userEvent.click(iconEye)
      expect(handleClickIconEye).toHaveBeenCalled()

      expect(modale.classList).toContain('show')
      
    })

    describe("When I click on the New bill button", () => {
      test("Then I should be redirected to new bill form", () => {
        const billsContainer = new Bills({
          document, onNavigate, firestore: null, localStorage: window.localStorage
        })

        const handleClickNewBill = jest.fn(billsContainer.handleClickNewBill)
        const newBillButton = screen.getByTestId('btn-new-bill')
        newBillButton.addEventListener('click', handleClickNewBill)
        userEvent.click(newBillButton)

        expect(handleClickNewBill).toHaveBeenCalled()
        expect(screen.getByText('Envoyer une note de frais')).toBeTruthy()
      })
    })

  })

  test('Loading page bill', () => {
    const bill = BillsUI({ data: bills, loading: true })
    document.body.innerHTML = bill

    expect(screen.getAllByText('Loading...')).toBeTruthy()
  })

  test('error page bill', () => {
    const bill = BillsUI({ data: bills, loading: false, error: 'Oups !' })
    document.body.innerHTML = bill

    expect(screen.getAllByText('Erreur')).toBeTruthy()
  })

})