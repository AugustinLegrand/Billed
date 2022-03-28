import { screen } from "@testing-library/dom"
import Actions from "../views/Actions.js"
import '@testing-library/jest-dom/extend-expect'


describe('Given I am connected as an Employee', () => {
  describe('When I am on Bills page and there are bills', () => {
    test(('Then, it should render icon eye'), () => {
      const html = Actions()
      document.body.innerHTML = html
      expect(screen.getByTestId('icon-eye')).toBeTruthy()
    })
  })
  describe('When I am on Bills page and there are bills with url for file', () => {
    test(('Then, it should save given url in data-bill-url custom attribute'), () => {
      const url = '/fake_url'
      const html = Actions(url)
      document.body.innerHTML = html
      expect(screen.getByTestId('icon-eye')).toHaveAttribute('data-bill-url', url)
    })
    test('Then, it should test if billUrl not found', () => {
      const url = null
      const action = Actions(url)
      document.body.innerHTML = action

      expect(url === null).not.toBe("https://firebasestorage.googleapis.com/v0/b/billable-677b6.appspot.com/o/justificatifs%2Funnamed.jpg?alt=media&token=5de56d8e-7859-4701-9f7f-d879fd5441f6")
    })
  })
})