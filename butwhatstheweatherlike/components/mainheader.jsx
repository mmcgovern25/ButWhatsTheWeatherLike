import icon from "@/app/icon.png"

export default function MainHeader() {
  return (
    <div className="flex justify-center items-center py-8 px-4">
      <img src={icon.src} alt="icon" className="w-20 h-20 object-contain filter drop-shadow-lg mr-4" />
      <h1 className="text-center text-5xl font-semibold text-white font-montserrat italic tracking-wide">
        But What's The Weather Like?
      </h1>
    </div>
  );
}