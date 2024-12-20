import { FC, useState, FormEvent } from "react";
import { toast } from "react-toastify";
import TextFormField from "./shared/TextFormField";
import { noterAuth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { UserCredential } from "@firebase/auth-types";
import createUser from "../firebase/dbhelpers/createUser";
import GoogleAuthButton from "./shared/GoogleAuthButton";
import Side from '../show/land/test'
type TextFormFieldProps = {
  required: boolean;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string; // Add className prop here
};
const Register: FC = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
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
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== checkPassword) {
      toast.error("Passwords do not match!");
      setCheckPassword("");
      return;
    }
    noterAuth
      .createUserWithEmailAndPassword(email, password)
      .catch((error) => {
        switch (error.code) {
          case "auth/email-already-in-use":
            toast.warning(
              <p className="text-gray-800">
                {error.message}{" "}
                <Link className="text-blue-600 underline" to="/login">
                  Click here to login
                </Link>
              </p>,
              {
                onClick: () => navigate("/login"),
              }
            );
        }
        console.log(error);
      })
      .then((value) => {
        let { additionalUserInfo, user } = value as UserCredential;
        if (additionalUserInfo?.isNewUser) {
          user?.updateProfile({
            displayName: fullname,
          });
          createUser({
            uid: user?.uid as string,
            email: user?.email as string,
            dp: user?.photoURL,
            fullname,
          });
        }
      });
  };
  const onSubmi = (email: string, password: string) => {
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

  return (<><Side />
    <div className="flex justify-center items-center w-full h-full bg-black px-2">
      <div className="max-w-xl w-full bg-black text-white rounded shadow-inner border-2 border-gray-700 p-8">
        <header>
        
          <h3 className="text-xl font-semibold mb-1.5">Create Account</h3>
          <h6 className="text-green-100">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 underline">
              Login
            </Link>
          </h6>
        </header>
        <main className="mt-6 mx-auto">
          <form onSubmit={onSubmit}>
            <TextFormField
              required
              label="Full name"
              type="fullname"
              placeholder="arjun....."
              value={fullname}
              onChange={(event) => void setFullname(event.target.value)}
              className="bg-black text-white border-gray-700"
            />
            <TextFormField
              required
              label="Email"
              type="email"
              placeholder="akd@gmail.com"
              value={email}
              onChange={(event) => void setEmail(event.target.value)}
              className="bg-black text-white border-gray-700"
            />
            <TextFormField
              required
              label="Password"
              type="password"
              placeholder="your password"
              value={password}
              onChange={(event) => void setPassword(event.target.value)}
              className="bg-black text-white border-gray-700"
            />
            <TextFormField
              required
              label="Re-type Password"
              type="password"
              placeholder="Re-type Password"
              value={checkPassword}
              onChange={(event) => void setCheckPassword(event.target.value)}
              className="bg-black text-white border-gray-700"
            />
            <input
              className="w-full transition-colors hover:bg-green-600 cursor-pointer rounded h-12 text-white font-medium text-base bg-green-900"
              type="submit"
              value="Register"
            />
          </form>
          
          <div>
          <button
              className="w-full transition-colors my-2 bg-green-500 bg-opacity-0 hover:bg-opacity-10 cursor-pointer rounded h-12 border-2 border-green-500 font-medium text-base text-green-500"
              onClick={(e) => {
                setEmail("arjunexisted@gmail.com");
                setPassword("aruuu");
                onSubmi("ee@ee.com", "eeeeeeee");
              }}
            >
              Login as Guest
            </button>
          </div>
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
    </div></>
  );
};

const Hr: FC = () => (
  <div className="h-0.5 bg-white bg-opacity-30 w-full"></div>
);

export default Register;
