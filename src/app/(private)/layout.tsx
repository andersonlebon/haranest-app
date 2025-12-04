import { PrivateRoute } from "@/components/auth/PrivateRoute";


const PrivateLayout = ({children }: { children: React.ReactNode }) => {
  return (
    <PrivateRoute>
      {children}
    </PrivateRoute>
  );
}

export default PrivateLayout;