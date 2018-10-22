##general procedure
git init
git add .
git commit -am"u"
git remote -v 
git remote add origin https://github.com/relaxslow/xsVision.git
git push origin master

##remove a folder
git rm -r --cached node_modules 
git commit -am"u"

##pull a repository
git init
git pull  https://github.com/relaxslow/xsVision.git