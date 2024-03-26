export const StepCard = ({number, title, desc, icon}) =>{


    return(
        <>

            <div className="step-card">
                <div className="icon-bg">
                    <img className="step-icon" src={icon} alt="" />
                </div>
                <span className="step-title">{title}</span>
                <span className="step-number">
                    {number}
                </span>
                <span className="step-description">{desc}</span>
            </div>
        
        </>

    )
}