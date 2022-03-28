import eyeBlueIcon from "../assets/svg/eye_blue.js"
import downloadBlueIcon from "../assets/svg/download_blue.js"

export default (billUrl) => {
  console.log(billUrl);
  console.log(eyeBlueIcon);
  
  function getUrl() {
    if (billUrl === null) return 'https://firebasestorage.googleapis.com/v0/b/billable-677b6.appspot.com/o/justificatifs%2Funnamed.jpg?alt=media&token=5de56d8e-7859-4701-9f7f-d879fd5441f6'
    return billUrl
  }
  return (
    `<div class="icon-actions">
      <div id="eye" data-testid="icon-eye" data-bill-url=${getUrl()}>
      ${eyeBlueIcon}
      </div>
    </div>`
  )
}