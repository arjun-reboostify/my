import { FC, useState } from "react";
import { toast } from "react-toastify";
import TextFormField from "./shared/TextFormField";
import { noterAuth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import GoogleAuthButton from "./shared/GoogleAuthButton";
type TextFormFieldProps = {
  required: boolean;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string; // Add className prop here
};

const Login: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const TextFormField: FC<TextFormFieldProps> = ({
    required,
    label,
    type,
    placeholder,
    value,
    onChange,
    className,
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-white">{label}</label>
      <input
        required={required}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full p-3 mt-2 bg-black text-white border-2 border-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
      />
    </div>
  );
  const onSubmit = (email: string, password: string) => {
    noterAuth.signInWithEmailAndPassword(email, password).catch((error) => {
      switch (error.code) {
        case "auth/user-not-found":
          toast.warning(
            <p className="text-white">
              Email Id does not exist!{" "}
              <Link className="text-blue-600 underline" to="/register">
                Click here to register
              </Link>
            </p>,
            {
              onClick: () => navigate("/register"),
            }
          );
      }
      console.log(error);
    });
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-black px-2">
      <div className="max-w-xl w-full bg-black text-white rounded shadow-inner border-2 border-gray-800 p-8">
        <header>
          <h1 className="text-4xl text-green-500 font-bold mb-6">Reboostify</h1>
          <h3 className="text-xl font-semibold mb-1.5">Welcome back</h3>
          <h6 className="">
            New here?{" "}
            <Link to="/register" className="text-blue-600 underline">
              Create an account
            </Link>
          </h6>
        </header>
        <main className="mt-6 mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(email, password);
            }}
          >
            <TextFormField
              required
              label="Email"
              type="email"
              placeholder="akd@gmail.com | if not first register your email"
              value={email}
              onChange={(event) => void setEmail(event.target.value)}
              className="bg-black text-white border-2 border-gray-800 focus:ring-green-500"
            />
            <TextFormField
              required
              label="Password"
              type="password"
              placeholder="your password"
              value={password}
              onChange={(event) => void setPassword(event.target.value)}
              className="bg-black text-white border-2 border-gray-800 focus:ring-green-500"
            />
            <input
              className="w-full transition-colors my-2 hover:bg-green-600 cursor-pointer rounded h-12 text-white font-medium text-base bg-green-500"
              type="submit"
              value="Login"
            />
            <button
              className="w-full transition-colors my-2 bg-green-500 bg-opacity-0 hover:bg-opacity-10 cursor-pointer rounded h-12 border-2 border-green-500 font-medium text-base text-green-500"
              onClick={(e) => {
                setEmail("arjunexisted@gmail.com");
                setPassword("aruuu");
                onSubmit("ee@ee.com", "eeeeeeee");
              }}
            >
              Login as Guest
            </button>
          </form>
          <div className="flex flex-row justify-between items-center gap-4 my-6">
            <Hr />
            <div className="font-medium text-gray-500">or</div>
            <Hr />
          </div>
          <div>
            <GoogleAuthButton />
          </div>
        </main>
      </div>
    </div>
  );
};

const Hr: FC = () => (
  <div className="h-0.5 bg-white bg-opacity-30 w-full"></div>
);

export default Login;
