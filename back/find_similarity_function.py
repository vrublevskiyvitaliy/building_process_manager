import cv2
from skimage.io import imread


def find_similarity(image, image_base):
    """
    Function for comparing two images with SIFT method
    
    @param image: path for image for comparison with base image
    @param image_base: path for base image to compare with
    @return similarity: similarity of corresponding images
    """
    
    img = imread(image)
    img_base = imread(image_base)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray_base = cv2.cvtColor(img_base, cv2.COLOR_BGR2GRAY)
    
    # compare shape and resize if needed
    print("1: {}, 2: {}".format(gray_base.shape[0:2], gray_base.shape[0:2][::-1]))
    if gray.shape[0:2] != gray_base.shape[0:2]:
        gray = cv2.resize(gray, dsize=gray_base.shape[0:2][::-1], interpolation=cv2.INTER_CUBIC)
    
    sift = cv2.xfeatures2d.SIFT_create()
    kp_base, desc_base = sift.detectAndCompute(gray_base, None)
    kp, desc = sift.detectAndCompute(gray, None)
    
    # BFMatcher with default params
    bf = cv2.BFMatcher()
    matches = bf.knnMatch( desc, desc_base,  k=2 )

    # Apply ratio test
    good = []
    for m,n in matches:
        if m.distance < 0.95*n.distance:
            good.append([m])
    
    features_12 = [len(kp_base), len(kp)]
    similarity = 100 * len(good) / min(features_12)
    
    return float('{0:.2f}'.format(similarity))