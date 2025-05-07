import { MagnifyingGlass } from "react-loader-spinner";

const SmallLoader: React.FC = () => {
  return (
    <MagnifyingGlass
      visible={true}
      height="80"
      width="80"
      ariaLabel="magnifying-glass-loading"
      wrapperStyle={{}}
      wrapperClass="magnifying-glass-wrapper"
      glassColor="#c0efff"
      color="#1d1c1c"
    />
  );
};

export default SmallLoader;
