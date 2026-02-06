const Contact = () => {
    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title justify-center text-primary">Contact Us</h2>
                    <p className="text-center">Have questions? We are here to help!</p>
                    
                    <div className="form-control w-full max-w-xs mt-4">
                        <label className="label"><span className="label-text">Your Email</span></label>
                        <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                    </div>
                    
                    <div className="form-control w-full max-w-xs mt-2">
                        <label className="label"><span className="label-text">Message</span></label>
                        <textarea className="textarea textarea-bordered h-24" placeholder="Your message"></textarea>
                    </div>

                    <div className="card-actions justify-center mt-4">
                        <button className="btn btn-primary w-full">Send Message</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;