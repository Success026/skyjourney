export default function Footer() {
  return (
    <footer className="bg-blue-600 text-white py-6 mt-12">
      <div className="container mx-auto px-6 text-center">
        &copy; {new Date().getFullYear()} SkyJourney. All rights reserved.
      </div>
    </footer>
  )
}