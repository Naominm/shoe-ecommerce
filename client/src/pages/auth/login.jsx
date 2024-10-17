import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true); // Start loading

    dispatch(loginUser(formData)).then((data) => {
      setIsLoading(false); // Stop loading
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h2 className="text-sm font-bold text-[#FC7106]">
          Welcome to Kanyoni Shoe Collection
        </h2>
      </div>

      {/* Form */}
      <CommonForm
        formControls={loginFormControls}
        buttonText={isLoading ? "Signing In..." : "Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        disabled={isLoading} // Disable form inputs while loading
      />

      {/* Loader */}
      {isLoading && (
        <div className="flex justify-center mt-4">
          <svg
            className="animate-spin h-8 w-8 text-[#FC7106]" // Styling the loader with Tailwind
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
        </div>
      )}

      <p className="mt-2 text-sm">
        Don't have an account?
        <Link
          className="font-small ml-2 text-primary hover:underline"
          to="/auth/register"
        >
          Register
        </Link>
      </p>
    </div>
  );
}

export default AuthLogin;
