import React from 'react'

const Footer = () => {
  return (
<footer className="footer mt-8 sm:footer-horizontal footer-center bg-[#242424] text-white p-4">
  <aside>
    <p>Copyright © {new Date().getFullYear()} - All right reserved by Task Management Company</p>
  </aside>
</footer>  )
}

export default Footer