
import React from "react";

import Logo from "../../components/svg/logo";

const Header: React.FC = () => {
    return (
        <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Logo alt="Capgemini" className="h-10 w-auto" />
                <span className="text-xl font-semibold text-[#0070AD] tracking-wide">
                    BLOGi
                </span>
            </div>
        </div>
    );
};

export default Header;
