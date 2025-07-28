import homepageImage from "../assets/homepage_img2.gif";
import feature1 from "../assets/Feature1.png";
import feature2 from "../assets/Feature2.png";
import feature3 from "../assets/Feature3.png";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#edfafa] to-[#c4f1f9] min-h-screen flex flex-col items-center justify-center px-6 md:px-20 py-16 text-center">
  <div className="max-w-3xl w-full flex flex-col items-center justify-center space-y-8">
    <div>
      <h1 className="text-5xl font-extrabold text-[#17252A] leading-tight mb-4">
        Smarter Rides.<br />Better Connections.
      </h1>
      <p className="text-lg text-[#2B7A78] mb-6">
        Welcome to <strong>CarPOOL</strong> — your modern carpooling solution to travel smarter, cheaper, and greener.
      </p>
      <a href="/search">
  <button className="px-6 py-3 bg-[#3AAFA9] hover:bg-[#2B7A78] text-white font-medium rounded-xl shadow-lg transition duration-300">
    Get Started
  </button>
</a>

    </div>

    <img
      src={homepageImage}
      alt="Hero Illustration"
      className="w-full max-w-lg rounded-3xl shadow-2xl border border-[#DEF2F1]"
    />
  </div>
</section>


      {/* Features Section */}
      <section className="bg-white py-20 px-6 md:px-20">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#17252A] mb-4">What We Offer</h2>
          <p className="text-md text-[#2B7A78]">
            Explore the features that make CarPOOL your go-to travel companion.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="bg-[#DEF2F1] p-8 rounded-3xl shadow-lg border border-[#2B7A78] hover:scale-105 transition duration-300">
            <img src={feature1} alt="Search" className="w-20 h-20 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-[#17252A] mb-4">Search</h3>
            <p className="text-[#2B7A78]">
              Find the perfect ride. Browse available trips based on location, time, and convenience.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#DEF2F1] p-8 rounded-3xl shadow-lg border border-[#2B7A78] hover:scale-105 transition duration-300">
            <img src={feature2} alt="Share" className="w-20 h-20 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-[#17252A] mb-4">Share</h3>
            <p className="text-[#2B7A78]">
              Share your ride in seconds. Let others hop in for a hassle-free journey.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#DEF2F1] p-8 rounded-3xl shadow-lg border border-[#2B7A78] hover:scale-105 transition duration-300">
            <img src={feature3} alt="Trips" className="w-20 h-20 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-[#17252A] mb-4">Trips</h3>
            <p className="text-[#2B7A78]">
              Manage your trips easily. View requests, track rides, and stay informed on the go.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HomePage;
