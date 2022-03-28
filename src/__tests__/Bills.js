import { getByTestId, getByText, screen } from "@testing-library/dom"
import userEvent from '@testing-library/user-event';
import { localStorageMock } from '../__mocks__/localStorage';
import { bills } from "../fixtures/bills.js"
import { ROUTES } from '../constants/routes';
import BillsUI from "../views/BillsUI.js"
import Bills from '../containers/Bills';
import firebase from '../__mocks__/firebase';
import LoadingPage from "../views/LoadingPage";

const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({ pathname })
}

describe("Given I am connected as an employee", () => {

  describe("When I am on Bills Page", () => {

    document.body.innerHTML = BillsUI({ data: bills })

    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))
    
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort((a, b) => b - a)
      expect(dates).toEqual(datesSorted)
    })

    test("When I click on the icon eye", () => {

      const billsContainer = new Bills({
        document, onNavigate, firestore: null, localStorage: window.localStorage
      })

      const handleClickNewBill = jest.fn(billsContainer.handleClickIconEye)
      const newBillButton = screen.getAllByTestId("icon-eye")
      newBillButton.forEach(e => {
        e.addEventListener('click', handleClickNewBill)
        userEvent.click(e)
        expect(handleClickNewBill).toHaveBeenCalled()
        return
      })


    })

    describe('When Bill page is Loading or Error page', () => {

        test('Then, it should test is loading page', () => {
          document.body.innerHTML = LoadingPage()
          expect(getByTestId(document.body, 'loading-message')).toBe("Loading...")
        })

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


})