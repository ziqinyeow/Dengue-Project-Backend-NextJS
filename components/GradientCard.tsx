const GradientCard: React.FC = ({ children }) => {
  return (
    <div className="relative group">
      <div className="absolute transition duration-1000 rounded-md -inset-2 bg-gradient-to-r from-blue-700 to-green-200 opacity-20 blur group-hover:opacity-100 group-hover:duration-200" />
      <div className="relative p-5 transition duration-200 bg-white rounded-md bg-gradient-to-r group-hover:bg-gradient-to-r group-hover:from-blue-700 group-hover:to-green-200 group-hover:text-white">
        {children}
      </div>
    </div>
  );
};

export default GradientCard;
