import Footer from "@/components/Application/Website/Footer";
import Header from "@/components/Application/Website/Header";

const layout=({children}:Readonly<{children:React.ReactNode}>)=>{
           return (
            <div>
                <Header/>
                {children}
                <Footer/>
            </div>
           );
}

export default layout