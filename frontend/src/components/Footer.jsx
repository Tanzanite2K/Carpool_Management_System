const Footer = () => {
  return (
    <footer className="text-white py-8 w-full" style={{ backgroundColor: '#3AAFA9' }}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <h2 className="text-2xl font-bold hover:text-gray-700 transition duration-300">
              Carpool
            </h2>
          </div>
          <div className="mt-4 text-center text-white">
            <p>&copy; {new Date().getFullYear()} Carpool. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;