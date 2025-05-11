import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="w-screen bg-white shadow-2xl py-16">
        <div className="w-full max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-black mb-8 leading-tight">
            Welcome to the Loan Eligibility Portal
          </h1>
          <p className="text-lg md:text-xl text-center text-black mb-10 leading-relaxed">
            Easily check your loan eligibility based on your income, age, and other important parameters. Get a quick assessment and take the next step towards your financial goals.
          </p>

          <div className="flex justify-center">
            <button
              onClick={() => navigate('/loan-eligibility')}
              className="px-8 py-4 rounded-lg bg-black text-white text-lg font-semibold shadow transition-colors duration-200 hover:bg-white  border border-black"
            >
              Check Eligibility
            </button>
          </div>
        </div>
      </div>

      <footer className="text-center text-sm text-gray-500 mt-10 tracking-wide">
        <p>&copy; 2025 Loan Eligibility Portal. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
