# jn-student-toolbar
A Jupyter Notebook extension for making a more student-friendly toolbar

# Directions

Make sure that nbextensions is installed on the server:

    pip3 install jupyter_contrib_nbextensions

Download the extension.

    git clone https://github.com/acbart/jn-student-toolbar.git
    cd jn-student-toolbar
    
Once downloaded, you can keep it in sync using regular Git tracking.

Install the extension (replace the path to the actual path, all the way to the folder that has `main.js` in it).

    jupyter nbextension install ./jn-student-toolbar/
    
Enable the extension.

    jupyter nbextension enable jn-student-toolbar/main
    
Here's the weird part. You just enabled the extension for the root user, but not for everyone. You might need to edit the global config file (`/usr/etc/jupyter/nbconfig/notebook.json`) to add the following entry:

    "jn-student-toolbar/main": true,

If that location isn't right, double check the possible locations according to the result from this command:

    jupyter nbextension list
    
I'm not entirely clear on how much of that was necessary, but it was what got me to a functioning point. I might have had to reboot my server too, but I'm not sure.
    
# Secrets

You can flip student mode on/off for a notebook by pressing "CTRL-ALT-U".

# Local Client Development

Most of the steps are the same as the above. You probably won't have to fuss with the weird part (where you adjust the config file).

# Updating

Once you've pushed changes to the GitHub, you can update the server by pulling it into the git folder and then running the `nbextension install` command above again.

